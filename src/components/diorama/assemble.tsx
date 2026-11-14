import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { Group } from "three";

function easeOutBack(t: number) {
  const c1 = 1.05;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

/** Parts travel up through the ground clip and settle with a small overshoot. */
export function Assemble({
  delay = 0,
  duration = 1,
  lift = 2.2,
  children,
}: {
  delay?: number;
  duration?: number;
  lift?: number;
  children: ReactNode;
}) {
  const ref = useRef<Group>(null);
  const done = useRef(false);

  useLayoutEffect(() => {
    if (ref.current) ref.current.position.y = -lift;
  }, [lift]);

  useFrame((state) => {
    const g = ref.current;
    if (!g || done.current) return;
    const p = Math.min(1, Math.max(0, (state.clock.elapsedTime - delay) / duration));
    const e = easeOutBack(p);
    g.position.y = -lift * (1 - e);
    if (p >= 1) {
      g.position.y = 0;
      done.current = true;
    }
  });

  return (
    <group ref={ref} position={[0, -lift, 0]}>
      {children}
    </group>
  );
}

/** Plinth pops out from the center like the tray of a model kit. */
export function AssembleScale({
  delay = 0,
  duration = 0.55,
  children,
}: {
  delay?: number;
  duration?: number;
  children: ReactNode;
}) {
  const ref = useRef<Group>(null);
  const done = useRef(false);

  useLayoutEffect(() => {
    if (ref.current) ref.current.scale.setScalar(0.001);
  }, []);

  useFrame((state) => {
    const g = ref.current;
    if (!g || done.current) return;
    const p = Math.min(1, Math.max(0, (state.clock.elapsedTime - delay) / duration));
    g.scale.setScalar(Math.max(0.001, easeOutBack(p)));
    if (p >= 1) {
      g.scale.setScalar(1);
      done.current = true;
    }
  });

  return <group ref={ref}>{children}</group>;
}
