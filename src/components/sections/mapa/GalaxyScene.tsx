"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import type { MotionValue } from "motion/react";

// @react-three/fiber instancia `new THREE.Clock()` internamente en createRoot
// (hardcodeado, sin opción de inyectar THREE.Timer) → warning de deprecación
// ajeno a nuestro código. Se filtra solo ese mensaje; el resto pasa intacto.
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].startsWith("THREE.Clock")) return;
  originalWarn(...args);
};

interface GalaxySceneProps {
  /** Progreso LOCAL del capítulo oscuro (0-1), ya remapeado por el padre */
  progress: MotionValue<number>;
}

function CameraRig({ progress }: GalaxySceneProps) {
  useFrame((state) => {
    const p = progress.get();
    // La cámara "cae" hacia el campo de estrellas mientras avanza el capítulo
    state.camera.position.z = 10 - p * 6;
    state.camera.rotation.z = p * 0.25;
  });
  return null;
}

export default function GalaxyScene({ progress }: GalaxySceneProps) {
  return (
    <Canvas
      // Móvil primero: DPR limitado, sin AA (las estrellas son puntos), bajo consumo
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 60 }}
      gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <Stars radius={45} depth={40} count={4000} factor={6} fade speed={1} />
      <CameraRig progress={progress} />
    </Canvas>
  );
}
