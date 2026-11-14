import { useMemo } from "react";
import { Assemble } from "./assemble";
import { Boxes, B, Cans, Cyl, type BoxItem, type CanItem } from "./primitives";
import { useTex, type KitTextures } from "./textures";

const PAL = [
  "#e23d3d",
  "#f2c14e",
  "#3aa0e8",
  "#f7f4ee",
  "#7bc96f",
  "#ff8fab",
  "#6b4c9a",
  "#f08a3e",
  "#2a9d8f",
  "#e9c46a",
  "#355c7d",
  "#f4d6a0",
];

const CAN_PAL = ["#e23d3d", "#f2c14e", "#3aa0e8", "#7bc96f", "#f7f4ee", "#6b4c9a"];

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stock(
  groups: Map<string, BoxItem[]>,
  x: number,
  z0: number,
  z1: number,
  y: number,
  n: number,
  depth: number,
  seed: number,
) {
  const rand = rng(seed);
  const span = Math.abs(z1 - z0);
  for (let i = 0; i < n; i++) {
    const z = z0 + (span * (i + 0.5)) / n;
    const color = PAL[Math.floor(rand() * PAL.length)]!;
    const sy = 0.13 + rand() * 0.15;
    const sx = Math.min(0.24, (span / n) * 0.8);
    const sz = depth * (0.62 + rand() * 0.38);
    const list = groups.get(color) ?? [];
    list.push({ x, y: y + sy / 2, z, sx, sy, sz });
    groups.set(color, list);
  }
}

function buildGoods() {
  const boxes = new Map<string, BoxItem[]>();
  const levels = [0.28, 0.86, 1.42, 1.98];
  levels.forEach((y, i) => {
    stock(boxes, -3.78, -2.3, 2.05, y, 14, 0.3, 11 + i);
    stock(boxes, 3.78, -2.35, -0.2, y, 8, 0.3, 40 + i);
  });
  [0.28, 0.78, 1.18].forEach((y, i) => {
    stock(boxes, -1.34, -1.25, 0.85, y, 8, 0.26, 70 + i);
    stock(boxes, -0.96, -1.25, 0.85, y, 8, 0.26, 90 + i);
    stock(boxes, 0.78, -1.55, 0.35, y, 7, 0.26, 110 + i);
    stock(boxes, 1.16, -1.55, 0.35, y, 7, 0.26, 130 + i);
  });

  const cans = new Map<string, CanItem[]>();
  CAN_PAL.forEach((c) => cans.set(c, []));
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 18; col++) {
      const color = CAN_PAL[(row * 3 + col) % CAN_PAL.length]!;
      const h = 0.2 + ((col + row) % 3) * 0.035;
      cans.get(color)!.push({
        x: -3.15 + col * 0.36,
        y: 0.38 + row * 0.42,
        z: -2.38,
        h,
        r: 0.055,
      });
    }
  }
  return { boxes, cans };
}

function Shell() {
  return (
    <group>
      <B a={[8.45, 0.1, 5.95]} p={[0, 0.05, 0]} c="#8e948f" recv />
      <B a={[8.2, 3.28, 0.14]} p={[0, 1.64, -2.85]} c="#f6f1e7" cast ink />
      <B a={[0.14, 3.28, 5.7]} p={[-4.1, 1.64, 0]} c="#f4eee4" cast ink />
      <B a={[0.16, 3.28, 3.05]} p={[4.1, 1.64, -1.32]} c="#f4eee4" cast ink />
      <B a={[0.9, 3.28, 0.18]} p={[-3.65, 1.64, 2.85]} c="#f7f2e8" cast ink />
      <B a={[0.9, 3.28, 0.18]} p={[3.65, 1.64, 2.85]} c="#f7f2e8" cast ink />
      <B a={[8.2, 0.78, 0.2]} p={[0, 2.89, 2.85]} c="#f7f2e8" cast />
      <B a={[8.05, 0.36, 0.05]} p={[0, 0.2, -2.94]} c="#6e7d78" />
      <B a={[0.05, 0.36, 5.5]} p={[-4.18, 0.2, 0]} c="#6e7d78" />
      <B a={[0.16, 0.42, 0.72]} p={[-4.28, 2.25, -0.35]} c="#e7eef2" cast ink />
      <Cyl p={[-4.38, 2.25, -0.35]} r={0.16} h={0.08} c="#22303a" rot={[0, 0, Math.PI / 2]} segs={16} />
      <B a={[0.08, 0.55, 0.08]} p={[-4.2, 1.7, -0.62]} c="#9aa3ab" />
      <B a={[0.1, 0.7, 0.55]} p={[-4.2, 1.55, 1.15]} c="#d7ecff" e="#ffe1b8" ei={0.45} />
      <B a={[0.22, 0.42, 0.32]} p={[2.2, 0.55, -3.05]} c="#c5ccd4" />
    </group>
  );
}

function Interior() {
  const tex = useTex();
  const goods = useMemo(() => buildGoods(), []);
  return (
    <group>
      <B a={[7.85, 0.06, 5.35]} p={[0, 0.13, 0]} c="#f4e7d2" recv />
      {[ -2, 0, 2 ].map((z) => (
        <B key={z} a={[7.6, 0.008, 0.02]} p={[0, 0.165, z]} c="#e4d3ba" />
      ))}

      {[0.22, 0.8, 1.36, 1.92].map((y) => (
        <B key={`ls${y}`} a={[0.42, 0.04, 4.45]} p={[-3.8, y, -0.12]} c="#e6d3b4" />
      ))}
      {[0.22, 0.8, 1.36, 1.92].map((y) => (
        <B key={`rs${y}`} a={[0.42, 0.04, 2.2]} p={[3.8, y, -1.25]} c="#e6d3b4" />
      ))}
      <B a={[0.08, 1.7, 0.08]} p={[-3.98, 0.95, -2.3]} c="#cbb892" />
      <B a={[0.08, 1.7, 0.08]} p={[-3.98, 0.95, 2.05]} c="#cbb892" />
      <B a={[0.08, 1.7, 0.08]} p={[3.98, 0.95, -2.3]} c="#cbb892" />
      <B a={[0.08, 1.7, 0.08]} p={[3.98, 0.95, -0.2]} c="#cbb892" />

      {[0.22, 0.72, 1.18].map((y) => (
        <B key={`g1${y}`} a={[0.7, 0.04, 2.2]} p={[-1.15, y, -0.2]} c="#efe3cc" />
      ))}
      {[0.22, 0.72, 1.18].map((y) => (
        <B key={`g2${y}`} a={[0.7, 0.04, 2.0]} p={[0.97, y, -0.6]} c="#efe3cc" />
      ))}
      <B a={[0.08, 1.15, 0.08]} p={[-1.45, 0.6, -1.25]} c="#d9c7a6" />
      <B a={[0.08, 1.15, 0.08]} p={[-0.85, 0.6, 0.85]} c="#d9c7a6" />
      <B a={[0.08, 1.15, 0.08]} p={[0.67, 0.6, -1.55]} c="#d9c7a6" />
      <B a={[0.08, 1.15, 0.08]} p={[1.27, 0.6, 0.35]} c="#d9c7a6" />

      {[...goods.boxes.entries()].map(([color, items]) => (
        <Boxes key={color} items={items} color={color} />
      ))}

      <B a={[7.2, 2.15, 0.42]} p={[0, 1.18, -2.52]} c="#d5e6f2" ink />
      <B a={[6.9, 1.9, 0.08]} p={[0, 1.2, -2.3]} c="#b9dcff" e="#d7f1ff" ei={0.85} />
      {[...goods.cans.entries()].map(([color, items]) => (
        <Cans key={color} items={items} color={color} />
      ))}
      {[-2.4, -0.8, 0.8, 2.4].map((x) => (
        <B key={`fd${x}`} a={[0.06, 1.95, 0.06]} p={[x, 1.18, -2.22]} c="#edf4f8" />
      ))}
      <B a={[6.9, 0.06, 0.06]} p={[0, 2.15, -2.22]} c="#edf4f8" />
      <mesh position={[0, 1.2, -2.18]}>
        <planeGeometry args={[6.7, 1.85]} />
        <meshToonMaterial color="#d7ecff" transparent opacity={0.18} depthWrite={false} />
      </mesh>

      <B a={[1.7, 0.96, 0.72]} p={[2.45, 0.58, 1.85]} c="#f7f1e6" cast ink />
      <B a={[1.55, 0.05, 0.62]} p={[2.45, 1.08, 1.85]} c="#e7d8c0" />
      <B a={[0.32, 0.22, 0.22]} p={[2.85, 1.22, 1.85]} c="#2a3038" />
      <B a={[0.22, 0.14, 0.04]} p={[2.85, 1.28, 1.98]} c="#9dffe0" e="#b8ffd8" ei={1.1} />
      <B a={[0.28, 0.12, 0.28]} p={[2.05, 1.16, 2.05]} c="#e23d3d" />
      <B a={[0.28, 0.1, 0.28]} p={[2.05, 1.27, 2.05]} c="#3aa0e8" />
      <B a={[0.36, 0.16, 0.28]} p={[1.55, 0.2, 1.7]} c="#d64545" />
      <B a={[0.36, 0.16, 0.28]} p={[1.55, 0.36, 1.7]} c="#3d7ec4" />

      <B a={[1.55, 0.72, 0.55]} p={[-2.55, 0.48, 2.05]} c="#c4553a" cast ink />
      <B a={[1.35, 0.42, 0.04]} p={[-2.55, 0.62, 2.32]} c="#ffd0a4" e="#ffb27a" ei={0.7} />
      <Cyl p={[-2.55, 0.55, 2.02]} r={0.28} h={0.22} c="#6a3a28" e="#ff9a55" ei={0.4} />
      {[-0.16, -0.05, 0.06, 0.15].map((x) => (
        <Cyl key={x} p={[-2.55 + x, 0.72, 2.02]} r={0.012} h={0.28} c="#f2e2c8" />
      ))}

      <B a={[0.7, 0.28, 0.45]} p={[-1.15, 0.28, 2.15]} c="#e7d3b0" />
      {[
        [-1.32, 0],
        [-1.16, 0.2],
        [-1.0, 0.05],
        [-1.28, -0.12],
        [-1.05, -0.16],
      ].map(([x, z], i) => (
        <group key={i} position={[x!, 0.48, 2.15 + z!]}>
          <mesh position={[0, 0.06, 0]}>
            <coneGeometry args={[0.07, 0.12, 3]} />
            <meshToonMaterial color="#f7f4ee" />
          </mesh>
          <B a={[0.09, 0.025, 0.07]} p={[0, 0.045, 0]} c="#243528" />
        </group>
      ))}

      <B a={[0.55, 1.35, 0.38]} p={[-3.45, 0.78, -1.7]} c="#2f5f86" ink />
      <B a={[0.32, 0.42, 0.04]} p={[-3.45, 1.05, -1.48]} c="#9fd0ff" e="#bfe4ff" ei={0.8} />
      <B a={[0.7, 0.45, 0.28]} p={[-3.7, 0.4, 1.55]} c="#d9c7a6" r={[-0.35, 0, 0]} />
      <B a={[0.5, 0.02, 0.22]} p={[-3.7, 0.55, 1.62]} c="#e23d3d" r={[-0.35, 0, 0]} />
      <B a={[0.5, 0.02, 0.22]} p={[-3.7, 0.48, 1.58]} c="#f2c14e" r={[-0.35, 0, 0]} />
      <B a={[0.5, 0.02, 0.22]} p={[-3.7, 0.41, 1.54]} c="#3aa0e8" r={[-0.35, 0, 0]} />

      <B a={[0.9, 0.16, 0.55]} p={[-2.15, 0.2, 2.2]} c="#e23d3d" />
      <B a={[0.28, 0.08, 0.32]} p={[-2.4, 0.32, 2.2]} c="#f08a3e" />
      <B a={[0.28, 0.08, 0.32]} p={[-2.05, 0.32, 2.2]} c="#7bc96f" />
      <B a={[0.28, 0.08, 0.32]} p={[-1.75, 0.28, 2.05]} c="#f2c14e" />

      {[
        [-1.15, tex.aisleBento],
        [0.15, tex.aisleSnack],
        [1.35, tex.aisleDrink],
      ].map(([x, map]) => (
        <mesh key={String(x)} position={[x as number, 2.72, -0.15]}>
          <planeGeometry args={[0.72, 0.28]} />
          <meshBasicMaterial map={map as KitTextures["aisleBento"]} toneMapped />
        </mesh>
      ))}

      {[-1.6, 0.15, 1.5].map((z) => (
        <B key={`fl${z}`} a={[1.35, 0.05, 0.22]} p={[0, 3.12, z]} c="#fff6df" e="#fff1cc" ei={1.4} />
      ))}
      <B a={[0.55, 0.06, 0.7]} p={[-1.15, 0.175, 2.45]} c="#234238" />
    </group>
  );
}

function Roof() {
  const tex = useTex();
  return (
    <group>
      <B a={[8.6, 0.12, 6.05]} p={[0, 3.36, 0]} c="#5c6574" cast />
      <B a={[0.1, 0.28, 5.85]} p={[-4.25, 3.52, 0]} c="#4c5564" />
      <B a={[0.1, 0.28, 5.85]} p={[4.25, 3.52, 0]} c="#4c5564" />
      <B a={[8.5, 0.28, 0.1]} p={[0, 3.52, -2.95]} c="#4c5564" />
      <B a={[0.7, 0.32, 0.55]} p={[-2.3, 3.58, -0.8]} c="#d5d8df" ink />
      <Cyl p={[-2.3, 3.78, -0.8]} r={0.1} h={0.12} c="#b7bec8" />

      <B a={[8.75, 0.07, 1.55]} p={[0, 2.78, 3.58]} c="#ff7d68" cast />
      <B a={[8.75, 0.02, 1.55]} p={[0, 2.74, 3.58]} c="#ffd3c4" e="#ffe1d4" ei={0.15} />
      {[-2.4, 0, 2.4].map((x) => (
        <B key={x} a={[0.28, 0.04, 0.18]} p={[x, 2.72, 3.35]} c="#fff4d2" e="#fff6df" ei={1.2} />
      ))}
      <Cyl p={[-3.7, 1.39, 4.05]} r={0.035} h={2.78} c="#4a403c" />
      <Cyl p={[3.7, 1.39, 4.05]} r={0.035} h={2.78} c="#4a403c" />

      <B a={[7.7, 1.02, 0.16]} p={[0, 3.78, 2.96]} c="#1c2744" cast ink />
      <mesh position={[0, 3.78, 3.06]}>
        <planeGeometry args={[7.45, 0.9]} />
        <meshBasicMaterial map={tex.fascia} toneMapped />
      </mesh>

      <group position={[4.45, 3.55, 2.05]}>
        <B a={[1.25, 1.35, 0.08]} p={[0.55, 0, 0]} c="#1c2744" ink />
        <mesh position={[0.55, 0, 0.05]} rotation={[0, 0, 0]}>
          <planeGeometry args={[1.15, 1.2]} />
          <meshBasicMaterial map={tex.blade} toneMapped />
        </mesh>
        <mesh position={[0.55, 0, -0.05]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.15, 1.2]} />
          <meshBasicMaterial map={tex.blade} toneMapped />
        </mesh>
      </group>
    </group>
  );
}

function GlassPane({
  p,
  a,
  rot,
}: {
  p: [number, number, number];
  a: [number, number];
  rot?: [number, number, number];
}) {
  return (
    <mesh position={p} rotation={rot} renderOrder={3}>
      <planeGeometry args={a} />
      <meshToonMaterial
        color="#d7ecff"
        transparent
        opacity={0.1}
        depthWrite={false}
        side={2}
        emissive="#9ec9ff"
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

function Glass() {
  const tex = useTex();
  return (
    <group>
      <GlassPane p={[-2.28, 1.32, 2.9]} a={[1.95, 2.25]} />
      <GlassPane p={[2.28, 1.32, 2.9]} a={[1.95, 2.25]} />
      <GlassPane p={[-0.52, 1.28, 2.92]} a={[0.92, 2.32]} />
      <GlassPane p={[0.52, 1.28, 2.92]} a={[0.92, 2.32]} />
      <GlassPane p={[4.16, 1.45, 1.4]} a={[1.85, 1.85]} rot={[0, Math.PI / 2, 0]} />

      <B a={[0.08, 2.45, 0.08]} p={[-1.18, 1.28, 2.9]} c="#2a3144" />
      <B a={[0.08, 2.45, 0.08]} p={[1.18, 1.28, 2.9]} c="#2a3144" />
      <B a={[0.06, 2.32, 0.06]} p={[0, 1.28, 2.94]} c="#1c2433" />
      <B a={[2.15, 0.06, 0.06]} p={[0, 2.48, 2.92]} c="#2a3144" />
      <B a={[1.15, 0.08, 0.1]} p={[0, 2.58, 3.02]} c="#1b1f2a" />
      <B a={[0.08, 0.08, 0.08]} p={[0, 2.58, 3.08]} c="#7ee0ff" e="#bff4ff" ei={1.3} />
      <B a={[0.9, 0.05, 0.02]} p={[-0.52, 0.18, 2.96]} c="#f2c14e" />
      <B a={[0.9, 0.05, 0.02]} p={[0.52, 0.18, 2.96]} c="#f2c14e" />

      <B a={[0.06, 1.9, 0.06]} p={[4.16, 1.45, 0.45]} c="#2a3144" />
      <B a={[0.06, 1.9, 0.06]} p={[4.16, 1.45, 2.35]} c="#2a3144" />
      <B a={[0.06, 0.06, 1.9]} p={[4.16, 2.38, 1.4]} c="#2a3144" />

      <mesh position={[-2.25, 1.72, 2.72]}>
        <planeGeometry args={[0.7, 0.95]} />
        <meshToonMaterial map={tex.posterNew} />
      </mesh>
      <mesh position={[2.2, 1.55, 2.72]}>
        <planeGeometry args={[0.62, 0.84]} />
        <meshToonMaterial map={tex.posterRice} />
      </mesh>
      <mesh position={[-2.55, 1.15, 2.2]} rotation={[0, 0.4, 0]}>
        <planeGeometry args={[0.48, 0.64]} />
        <meshToonMaterial map={tex.posterOden} />
      </mesh>
      <mesh position={[1.85, 2.22, 2.78]}>
        <planeGeometry args={[0.62, 0.28]} />
        <meshBasicMaterial map={tex.open} toneMapped />
      </mesh>

      {[
        [-2.7, 0.35],
        [-1.7, -0.2],
        [2.0, 0.25],
      ].map(([x, lean], i) => (
        <mesh key={i} position={[x!, 1.7, 2.98]} rotation={[0, 0, lean!]}>
          <planeGeometry args={[0.025, 0.7]} />
          <meshBasicMaterial color="#e7f3ff" transparent opacity={0.45} depthWrite={false} />
        </mesh>
      ))}

      <B a={[1.15, 0.025, 0.7]} p={[0, 0.2, 3.35]} c="#ffffff" map={tex.mat} />
    </group>
  );
}

export function Store() {
  return (
    <group position={[-0.4, 0, -1.35]}>
      <Assemble delay={0.72} duration={1.28} lift={4.4}>
        <Shell />
      </Assemble>
      <Assemble delay={1.62} duration={1.12} lift={3.6}>
        <Interior />
      </Assemble>
      <Assemble delay={2.38} duration={1.02} lift={4.85}>
        <Roof />
      </Assemble>
      <Assemble delay={3.05} duration={0.88} lift={3.7}>
        <Glass />
      </Assemble>
    </group>
  );
}
