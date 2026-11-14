import { useMemo } from "react";
import * as THREE from "three";
import { GROUND_CLIP, INK, getGradient } from "./materials";

type V3 = [number, number, number];

export function B({
  a,
  p,
  r,
  c,
  e,
  ei = 0.6,
  cast = false,
  recv = false,
  clip = true,
  opacity = 1,
  ink = false,
  map,
}: {
  a: V3;
  p: V3;
  r?: V3 | number[];
  c: string;
  e?: string;
  ei?: number;
  cast?: boolean;
  recv?: boolean;
  clip?: boolean;
  opacity?: number;
  ink?: boolean;
  map?: THREE.Texture;
}) {
  const transparent = opacity < 1;
  const edges = useMemo(() => {
    if (!ink) return null;
    return new THREE.EdgesGeometry(new THREE.BoxGeometry(a[0], a[1], a[2]), 22);
  }, [ink, a[0], a[1], a[2]]);

  return (
    <mesh position={p} rotation={r as [number, number, number] | undefined} castShadow={cast} receiveShadow={recv}>
      <boxGeometry args={a} />
      <meshToonMaterial
        color={c}
        map={map}
        gradientMap={getGradient()}
        emissive={e ?? "#000000"}
        emissiveIntensity={e ? ei : 0}
        clippingPlanes={clip ? GROUND_CLIP : undefined}
        transparent={transparent}
        opacity={opacity}
        depthWrite={!transparent}
      />
      {edges && (
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={INK} clippingPlanes={GROUND_CLIP} />
        </lineSegments>
      )}
    </mesh>
  );
}

export function Cyl({
  p,
  r = 0.1,
  h = 1,
  c,
  e,
  ei = 0.5,
  clip = true,
  cast = false,
  segs = 10,
  rot,
  opacity = 1,
}: {
  p: V3;
  r?: number;
  h?: number;
  c: string;
  e?: string;
  ei?: number;
  clip?: boolean;
  cast?: boolean;
  segs?: number;
  rot?: V3;
  opacity?: number;
}) {
  const transparent = opacity < 1;
  return (
    <mesh position={p} rotation={rot} castShadow={cast}>
      <cylinderGeometry args={[r, r, h, segs]} />
      <meshToonMaterial
        color={c}
        gradientMap={getGradient()}
        emissive={e ?? "#000000"}
        emissiveIntensity={e ? ei : 0}
        clippingPlanes={clip ? GROUND_CLIP : undefined}
        transparent={transparent}
        opacity={opacity}
        depthWrite={!transparent}
      />
    </mesh>
  );
}

export function Strut({
  a,
  b,
  r = 0.02,
  c = "#f3efe6",
  clip = true,
}: {
  a: V3;
  b: V3;
  r?: number;
  c?: string;
  clip?: boolean;
}) {
  const pose = useMemo(() => {
    const va = new THREE.Vector3(a[0], a[1], a[2]);
    const vb = new THREE.Vector3(b[0], b[1], b[2]);
    const dir = vb.clone().sub(va);
    const length = Math.max(dir.length(), 0.001);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize(),
    );
    const position = va.add(vb).multiplyScalar(0.5);
    return { position, quaternion, length };
  }, [a[0], a[1], a[2], b[0], b[1], b[2]]);

  return (
    <mesh position={pose.position} quaternion={pose.quaternion}>
      <cylinderGeometry args={[r, r, pose.length, 6]} />
      <meshToonMaterial
        color={c}
        gradientMap={getGradient()}
        clippingPlanes={clip ? GROUND_CLIP : undefined}
      />
    </mesh>
  );
}

export type BoxItem = {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
};

export function Boxes({
  items,
  color,
  cast = false,
}: {
  items: BoxItem[];
  color: string;
  cast?: boolean;
}) {
  const ref = useMemo(() => new THREE.Object3D(), []);
  const mesh = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshToonMaterial({
      color,
      gradientMap: getGradient(),
      clippingPlanes: GROUND_CLIP,
    });
    const im = new THREE.InstancedMesh(geo, mat, Math.max(items.length, 1));
    im.frustumCulled = false;
    im.castShadow = cast;
    const dummy = ref;
    items.forEach((it, i) => {
      dummy.position.set(it.x, it.y, it.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(it.sx, it.sy, it.sz);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
    });
    im.count = items.length;
    im.instanceMatrix.needsUpdate = true;
    return im;
  }, [items, color, cast, ref]);

  if (items.length === 0) return null;
  return <primitive object={mesh} />;
}

export type CanItem = { x: number; y: number; z: number; h: number; r: number };

export function Cans({ items, color }: { items: CanItem[]; color: string }) {
  const mesh = useMemo(() => {
    const geo = new THREE.CylinderGeometry(1, 1, 1, 8);
    const mat = new THREE.MeshToonMaterial({
      color,
      gradientMap: getGradient(),
      clippingPlanes: GROUND_CLIP,
    });
    const im = new THREE.InstancedMesh(geo, mat, Math.max(items.length, 1));
    im.frustumCulled = false;
    const dummy = new THREE.Object3D();
    items.forEach((it, i) => {
      dummy.position.set(it.x, it.y, it.z);
      dummy.scale.set(it.r, it.h, it.r);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
    });
    im.count = items.length;
    im.instanceMatrix.needsUpdate = true;
    return im;
  }, [items, color]);
  if (items.length === 0) return null;
  return <primitive object={mesh} />;
}
