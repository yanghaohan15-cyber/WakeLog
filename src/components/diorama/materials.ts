import * as THREE from "three";

let gradient: THREE.DataTexture | null = null;

/** Hard cel bands: shadow, mid, light, hairline highlight. */
export function getGradient(): THREE.DataTexture {
  if (gradient) return gradient;
  const data = new Uint8Array([
    58, 62, 78, 255,
    128, 132, 148, 255,
    214, 216, 224, 255,
    255, 255, 255, 255,
  ]);
  gradient = new THREE.DataTexture(data, 4, 1);
  gradient.magFilter = THREE.NearestFilter;
  gradient.minFilter = THREE.NearestFilter;
  gradient.wrapS = THREE.ClampToEdgeWrapping;
  gradient.wrapT = THREE.ClampToEdgeWrapping;
  gradient.colorSpace = THREE.NoColorSpace;
  gradient.needsUpdate = true;
  return gradient;
}

/** World-space plane: discard everything below the plinth top while parts rise. */
export const GROUND_CLIP = [new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.015)];

export const INK = "#1c1722";
