import { useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { Assemble } from "./assemble";
import { GROUND_CLIP, getGradient } from "./materials";
import { B, Cyl, Strut } from "./primitives";
import { useTex } from "./textures";

const Y = 0.18;

function Bike() {
  return (
    <group position={[-1.85, Y, 2.28]} rotation={[0, 0.55, 0.06]}>
      <mesh position={[-0.48, 0.34, 0]}>
        <torusGeometry args={[0.34, 0.028, 8, 18]} />
        <meshToonMaterial color="#24282e" gradientMap={getGradient()} clippingPlanes={GROUND_CLIP} />
      </mesh>
      <mesh position={[0.5, 0.34, 0]}>
        <torusGeometry args={[0.34, 0.028, 8, 18]} />
        <meshToonMaterial color="#24282e" gradientMap={getGradient()} clippingPlanes={GROUND_CLIP} />
      </mesh>
      <mesh position={[-0.48, 0.34, 0]}>
        <torusGeometry args={[0.3, 0.012, 6, 16]} />
        <meshToonMaterial color="#c5c8ce" gradientMap={getGradient()} clippingPlanes={GROUND_CLIP} />
      </mesh>
      <mesh position={[0.5, 0.34, 0]}>
        <torusGeometry args={[0.3, 0.012, 6, 16]} />
        <meshToonMaterial color="#c5c8ce" gradientMap={getGradient()} clippingPlanes={GROUND_CLIP} />
      </mesh>
      <Strut a={[-0.48, 0.34, 0]} b={[0.08, 0.34, 0]} r={0.02} c="#f4f1ea" />
      <Strut a={[0.08, 0.34, 0]} b={[0.42, 0.62, 0]} r={0.02} c="#f4f1ea" />
      <Strut a={[0.42, 0.62, 0]} b={[-0.1, 0.7, 0]} r={0.018} c="#f4f1ea" />
      <Strut a={[-0.1, 0.7, 0]} b={[-0.48, 0.34, 0]} r={0.02} c="#f4f1ea" />
      <Strut a={[-0.48, 0.34, 0]} b={[-0.22, 0.62, 0]} r={0.016} c="#7d9a90" />
      <Strut a={[0.5, 0.34, 0]} b={[0.42, 0.62, 0]} r={0.016} c="#f4f1ea" />
      <B a={[0.16, 0.05, 0.1]} p={[-0.08, 0.74, 0]} c="#6b3a2a" />
      <Strut a={[0.5, 0.62, -0.16]} b={[0.5, 0.62, 0.16]} r={0.016} c="#2c3138" />
      <Strut a={[0.5, 0.62, 0.16]} b={[0.62, 0.72, 0.2]} r={0.014} c="#2c3138" />
      <Strut a={[0.5, 0.62, -0.16]} b={[0.62, 0.72, -0.2]} r={0.014} c="#2c3138" />
      <B a={[0.22, 0.1, 0.26]} p={[0.62, 0.5, 0]} c="#d7ddd4" />
      <Strut a={[-0.2, 0.05, 0.08]} b={[-0.42, 0.34, 0]} r={0.012} c="#2c3138" />
    </group>
  );
}

function Umbrella({
  color,
  rot,
  open = true,
}: {
  color: string;
  rot: number;
  open?: boolean;
}) {
  return (
    <group rotation={[open ? 0.15 : 0.05, rot, 0]}>
      <Cyl p={[0, 0.34, 0]} r={0.012} h={0.62} c="#2a2e33" />
      {open ? (
        <mesh position={[0, 0.62, 0]}>
          <coneGeometry args={[0.26, 0.2, 8]} />
          <meshToonMaterial color={color} gradientMap={getGradient()} clippingPlanes={GROUND_CLIP} />
        </mesh>
      ) : (
        <Cyl p={[0, 0.62, 0]} r={0.03} h={0.28} c={color} />
      )}
      <mesh position={[0.045, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.045, 0.01, 6, 10, Math.PI]} />
        <meshToonMaterial color="#2a2e33" gradientMap={getGradient()} clippingPlanes={GROUND_CLIP} />
      </mesh>
    </group>
  );
}

function UmbrellaStand() {
  const colors = ["#f2d64b", "#e24b4b", "#2f6f8f", "#f7f7f7", "#6ec8c4", "#e89ac8"];
  return (
    <group position={[-0.95, Y, 2.42]}>
      <B a={[0.62, 0.06, 0.32]} p={[0, 0.05, 0]} c="#8d939c" />
      <B a={[0.62, 0.42, 0.035]} p={[0, 0.28, 0.13]} c="#9aa1aa" />
      <B a={[0.62, 0.42, 0.035]} p={[0, 0.28, -0.13]} c="#9aa1aa" />
      <B a={[0.035, 0.42, 0.28]} p={[-0.29, 0.28, 0]} c="#9aa1aa" />
      <B a={[0.035, 0.42, 0.28]} p={[0.29, 0.28, 0]} c="#9aa1aa" />
      {colors.map((color, i) => (
        <group key={color} position={[-0.2 + (i % 3) * 0.2, 0.12, i < 3 ? -0.04 : 0.04]}>
          <Umbrella color={color} rot={i * 0.4} open={i !== 4} />
        </group>
      ))}
    </group>
  );
}

function Vending({
  position,
  map,
  body,
}: {
  position: [number, number, number];
  map: THREE.Texture;
  body: string;
}) {
  return (
    <group position={position}>
      <B a={[0.9, 1.86, 0.64]} p={[0, 0.93, 0]} c={body} cast ink />
      <mesh position={[0, 1.12, 0.33]}>
        <planeGeometry args={[0.74, 1.28]} />
        <meshBasicMaterial map={map} toneMapped />
      </mesh>
      <B a={[0.62, 0.07, 0.04]} p={[0, 0.32, 0.34]} c="#14181f" />
      <B a={[0.16, 0.1, 0.05]} p={[0.26, 0.52, 0.34]} c="#222833" />
      <B a={[0.9, 0.06, 0.66]} p={[0, 1.86, 0]} c="#d9dee6" />
    </group>
  );
}

function Trash() {
  const tex = useTex();
  return (
    <group position={[4.02, Y, -2.15]}>
      <B a={[0.48, 0.82, 0.42]} p={[-0.3, 0.41, 0]} c="#d7ddd4" cast ink />
      <B a={[0.5, 0.06, 0.44]} p={[-0.3, 0.84, 0]} c="#6e756f" />
      <mesh position={[-0.3, 0.48, 0.22]}>
        <planeGeometry args={[0.32, 0.16]} />
        <meshBasicMaterial map={tex.burn} toneMapped />
      </mesh>
      <B a={[0.48, 0.82, 0.42]} p={[0.28, 0.41, 0]} c="#3d7ea6" cast ink />
      <B a={[0.5, 0.06, 0.44]} p={[0.28, 0.84, 0]} c="#24556f" />
      <mesh position={[0.28, 0.48, 0.22]}>
        <planeGeometry args={[0.32, 0.16]} />
        <meshBasicMaterial map={tex.can} toneMapped />
      </mesh>
    </group>
  );
}

function Bulletin() {
  const tex = useTex();
  return (
    <group position={[-3.35, Y, 2.32]}>
      <B a={[0.08, 1.35, 0.08]} p={[-0.48, 0.67, 0]} c="#6b4a32" />
      <B a={[0.08, 1.35, 0.08]} p={[0.48, 0.67, 0]} c="#6b4a32" />
      <B a={[1.15, 1.45, 0.08]} p={[0, 0.95, 0]} c="#6b4a32" ink />
      <mesh position={[0, 0.98, 0.05]}>
        <planeGeometry args={[1.0, 1.25]} />
        <meshBasicMaterial map={tex.bulletin} toneMapped />
      </mesh>
    </group>
  );
}

function Post() {
  return (
    <group position={[-4.15, Y, 2.15]}>
      <B a={[0.46, 0.7, 0.42]} p={[0, 0.55, 0]} c="#d64545" cast ink />
      <B a={[0.5, 0.08, 0.46]} p={[0, 0.92, 0]} c="#b43333" />
      <B a={[0.22, 0.1, 0.04]} p={[0, 0.62, 0.23]} c="#f4efe6" />
      <Cyl p={[0, 0.28, 0]} r={0.06} h={0.28} c="#8d3030" />
    </group>
  );
}

function Lamp() {
  return (
    <group position={[5.7, 0, 4.35]}>
      <Cyl p={[0, 1.7, 0]} r={0.06} h={3.4} c="#2a2e33" cast />
      <Strut a={[0, 3.35, 0]} b={[0.35, 3.15, 0.15]} r={0.035} c="#2a2e33" />
      <B a={[0.28, 0.1, 0.45]} p={[0.48, 3.08, 0.18]} c="#1c2128" />
      <B a={[0.18, 0.05, 0.32]} p={[0.48, 3.01, 0.18]} c="#ffd7a2" e="#ffc27a" ei={1.5} />
    </group>
  );
}

function Mirror() {
  return (
    <group position={[-5.15, Y, 1.25]}>
      <Cyl p={[0, 1.15, 0]} r={0.045} h={2.3} c="#f2c14e" />
      <Cyl p={[0, 0.4, 0]} r={0.05} h={0.35} c="#1c2128" />
      <Cyl p={[0, 1.15, 0]} r={0.05} h={0.35} c="#1c2128" />
      <mesh position={[0.08, 2.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.08, 20]} />
        <meshToonMaterial color="#f2c14e" gradientMap={getGradient()} clippingPlanes={GROUND_CLIP} />
      </mesh>
      <mesh position={[0.13, 2.25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.22, 20]} />
        <meshBasicMaterial color="#9ec9ea" />
      </mesh>
    </group>
  );
}

function Rail() {
  return (
    <group>
      {[1.7, 2.5, 3.3, 4.05].map((x) => (
        <Cyl key={`a${x}`} p={[x, Y + 0.28, 2.92]} r={0.03} h={0.56} c="#c5ccd4" />
      ))}
      <B a={[2.5, 0.04, 0.04]} p={[2.85, Y + 0.48, 2.92]} c="#d5dbe3" />
      <B a={[2.5, 0.04, 0.04]} p={[2.85, Y + 0.28, 2.92]} c="#d5dbe3" />
      {[1.4, 2.1, 2.7].map((z) => (
        <Cyl key={`b${z}`} p={[4.48, Y + 0.28, z]} r={0.03} h={0.56} c="#c5ccd4" />
      ))}
      <B a={[0.04, 0.04, 1.5]} p={[4.48, Y + 0.48, 2.05]} c="#d5dbe3" />
      <B a={[0.04, 0.04, 1.5]} p={[4.48, Y + 0.28, 2.05]} c="#d5dbe3" />
    </group>
  );
}

function Poles() {
  const wires = useMemo(() => {
    const spans: [THREE.Vector3, THREE.Vector3, number][] = [
      [new THREE.Vector3(-7.5, 6.7, -6.6), new THREE.Vector3(7.3, 6.55, 5.4), 1.15],
      [new THREE.Vector3(-7.5, 6.35, -6.6), new THREE.Vector3(7.3, 6.2, 5.4), 1.05],
      [new THREE.Vector3(7.3, 6.4, 5.4), new THREE.Vector3(3.3, 4.15, 0.9), 0.45],
      [new THREE.Vector3(-7.5, 6.5, -6.6), new THREE.Vector3(-4.6, 3.7, -1.6), 0.55],
    ];
    return spans.map(([a, b, sag]) => {
      const mid = a.clone().lerp(b, 0.5);
      mid.y -= sag;
      const q1 = a.clone().lerp(b, 0.25);
      q1.y -= sag * 0.62;
      const q2 = a.clone().lerp(b, 0.75);
      q2.y -= sag * 0.62;
      const curve = new THREE.CatmullRomCurve3([a, q1, mid, q2, b]);
      return new THREE.TubeGeometry(curve, 18, 0.018, 5, false);
    });
  }, []);

  return (
    <group>
      <Assemble delay={4.05} duration={1.15} lift={8.2}>
        <group position={[-7.5, 0, -6.6]}>
          <Cyl p={[0, 3.5, 0]} r={0.11} h={7} c="#b7b8b4" cast />
          <B a={[1.3, 0.08, 0.08]} p={[0, 6.55, 0]} c="#8d9298" />
          <B a={[0.08, 0.08, 0.7]} p={[0.15, 6.35, 0]} c="#8d9298" />
          <B a={[0.55, 0.45, 0.4]} p={[0.2, 5.3, 0]} c="#3a4148" />
        </group>
        <group position={[7.3, 0, 5.4]}>
          <Cyl p={[0, 3.45, 0]} r={0.11} h={6.9} c="#b7b8b4" cast />
          <B a={[1.2, 0.08, 0.08]} p={[0, 6.4, 0]} c="#8d9298" />
          <B a={[0.5, 0.4, 0.36]} p={[-0.15, 5.15, 0]} c="#3a4148" />
        </group>
      </Assemble>
      <Assemble delay={4.55} duration={0.9} lift={3.2}>
        {wires.map((geo, i) => (
          <mesh key={i} geometry={geo}>
            <meshBasicMaterial color="#2a3140" />
          </mesh>
        ))}
      </Assemble>
    </group>
  );
}

function Signs() {
  const tex = useTex();
  return (
    <group position={[5.15, 0, 3.55]}>
      <Cyl p={[0, 1.15, 0]} r={0.04} h={2.3} c="#9aa0a8" />
      <mesh position={[0.08, 2.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.95, 0.32]} />
        <meshBasicMaterial map={tex.streetA} toneMapped side={2} />
      </mesh>
      <mesh position={[0, 1.75, 0.08]}>
        <planeGeometry args={[0.95, 0.32]} />
        <meshBasicMaterial map={tex.streetB} toneMapped side={2} />
      </mesh>
      <mesh position={[-0.02, 2.55, 0]}>
        <circleGeometry args={[0.18, 20]} />
        <meshBasicMaterial map={tex.oneway} toneMapped />
      </mesh>
    </group>
  );
}

function AlleyBits() {
  return (
    <group>
      <B a={[0.45, 0.28, 0.45]} p={[-6.4, 0.16, -2.4]} c="#c4a574" />
      <B a={[0.4, 0.24, 0.4]} p={[-6.15, 0.42, -2.25]} c="#8d5a3c" />
      <B a={[0.32, 0.2, 0.36]} p={[-6.55, 0.12, -1.6]} c="#d7c4a4" />
      <Cyl p={[-6.35, 2.55, -1.15]} r={0.05} h={0.9} c="#3a4148" />
      <mesh position={[-6.35, 2.05, -1.15]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#ffd7a2" />
      </mesh>
      <B a={[0.55, 0.7, 0.4]} p={[-7.6, 0.35, -6.8]} c="#8a9098" />
      {Array.from({ length: 14 }, (_, i) => (
        <B key={i} a={[0.06, 0.85, 0.06]} p={[-7.8 + i * 0.72, 0.5, -8.55]} c="#8d8680" />
      ))}
      <B a={[10, 0.05, 0.05]} p={[-4.2, 0.92, -8.55]} c="#8d8680" />
    </group>
  );
}

function Plant() {
  return (
    <group position={[-2.7, Y, 2.5]}>
      <Cyl p={[0, 0.16, 0]} r={0.16} h={0.28} c="#8d4d3a" />
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshToonMaterial color="#3f7d55" gradientMap={getGradient()} clippingPlanes={GROUND_CLIP} />
      </mesh>
    </group>
  );
}

export function Props() {
  const tex = useTex();
  const pieces: { delay: number; lift?: number; node: ReactNode; key: string }[] = [
    { key: "bike", delay: 3.15, node: <Bike /> },
    { key: "umb", delay: 3.22, node: <UmbrellaStand /> },
    {
      key: "v1",
      delay: 3.3,
      node: <Vending position={[3.35, Y, 2.22]} map={tex.vendDrink} body="#c43744" />,
    },
    {
      key: "v2",
      delay: 3.38,
      node: <Vending position={[4.25, Y, 2.22]} map={tex.vendCafe} body="#2a4e9e" />,
    },
    { key: "trash", delay: 3.46, node: <Trash /> },
    { key: "board", delay: 3.54, node: <Bulletin /> },
    { key: "post", delay: 3.6, node: <Post /> },
    { key: "lamp", delay: 3.7, lift: 4.4, node: <Lamp /> },
    { key: "mirror", delay: 3.78, lift: 3.1, node: <Mirror /> },
    { key: "rail", delay: 3.86, node: <Rail /> },
    { key: "signs", delay: 3.94, lift: 3.4, node: <Signs /> },
    { key: "alley", delay: 3.5, lift: 3.2, node: <AlleyBits /> },
    { key: "plant", delay: 4.0, node: <Plant /> },
  ];
  return (
    <group>
      {pieces.map((piece) => (
        <Assemble key={piece.key} delay={piece.delay} duration={0.82} lift={piece.lift ?? 2.35}>
          {piece.node}
        </Assemble>
      ))}
      <Poles />
    </group>
  );
}
