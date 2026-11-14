import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 460;

export function Rain() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const ripples = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const drops = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * 18.2,
        y: Math.random() * 10,
        z: (Math.random() - 0.5) * 18.2,
        v: 7.5 + Math.random() * 6,
        s: 0.55 + Math.random() * 0.9,
      })),
    [],
  );
  const rings = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        x: i < 8 ? -2 + Math.random() * 8 : 4.8 + Math.random() * 3.4,
        z: i < 8 ? 3.2 + Math.random() * 5 : -1 + Math.random() * 6,
        o: Math.random(),
      })),
    [],
  );

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const k = Math.min(1, Math.max(0, (state.clock.elapsedTime - 4.85) / 1.15));
    const inst = mesh.current;
    if (inst) {
      for (let i = 0; i < COUNT; i++) {
        const p = drops[i]!;
        p.y -= p.v * d;
        p.x += 0.6 * d;
        if (p.y < 0.08) {
          p.y = 8.2 + Math.random() * 3.5;
          p.x = (Math.random() - 0.5) * 18;
          p.z = (Math.random() - 0.5) * 18;
        }
        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(0, 0, -0.14);
        dummy.scale.set(0.014, 0.3 * p.s, 0.014);
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
      }
      inst.instanceMatrix.needsUpdate = true;
      (inst.material as THREE.MeshBasicMaterial).opacity = 0.55 * k;
    }
    const g = ripples.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const data = rings[i]!;
      const u = (state.clock.elapsedTime * 0.32 + data.o) % 1;
      child.position.set(data.x, 0.072, data.z);
      const sc = 0.15 + u * 0.75;
      child.scale.setScalar(sc);
      ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - u) * 0.3 * k;
    });
  });

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#d7e7ff" transparent opacity={0} depthWrite={false} />
      </instancedMesh>
      <group ref={ripples}>
        {rings.map((_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.72, 1, 16]} />
            <meshBasicMaterial color="#d6e6ff" transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
