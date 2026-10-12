"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import type { Group } from "three";

// @react-three/fiber instancia `new THREE.Clock()` internamente en createRoot
// (hardcodeado, sin opción de inyectar THREE.Timer) → warning de deprecación
// ajeno a nuestro código. Se filtra solo ese mensaje; el resto pasa intacto.
if (process.env.NODE_ENV === "development") {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].startsWith("THREE.Clock"))
      return;
    originalWarn(...args);
  };
}

interface GalaxySceneProps {
  /** Progreso LOCAL del capítulo oscuro (0-1), ya remapeado por el padre */
  progress: MotionValue<number>;
  /** true mientras starsOpacity > 0 — solo entonces corre el render loop */
  active: boolean;
}

function CameraRig({ progress }: { progress: MotionValue<number> }) {
  useFrame((state) => {
    const p = progress.get();
    const t = state.clock.elapsedTime;
    // La cámara "cae" hacia el campo de estrellas mientras avanza el capítulo
    state.camera.position.z = 10 - p * 6;
    state.camera.rotation.z = p * 0.25;
    // Balanceo sinusoidal constante: sensación de flotar aunque el scroll
    // esté detenido (amplitud pequeña para no marear)
    state.camera.position.x = Math.sin(t * 0.15) * 0.35;
    state.camera.position.y = Math.cos(t * 0.11) * 0.25;
  });
  return null;
}

// Dos capas a distinta distancia y velocidad de deriva → parallax real:
// el cerebro lo lee como profundidad, no como "estrellas que respiran"
function DriftingStars() {
  const far = useRef<Group>(null);
  const near = useRef<Group>(null);

  useFrame((_, delta) => {
    if (far.current) far.current.rotation.y += delta * 0.006;
    if (near.current) near.current.rotation.y += delta * 0.014;
  });

  return (
    <>
      <group ref={far}>
        <Stars
          radius={55}
          depth={45}
          count={2600}
          factor={4}
          fade
          speed={0.7}
        />
      </group>
      <group ref={near}>
        <Stars radius={20} depth={18} count={900} factor={7} fade speed={1.3} />
      </group>
      {/* Polvo cercano dorado: otra señal de profundidad a escala distinta */}
      <Sparkles
        count={80}
        scale={[24, 14, 24]}
        size={2.5}
        speed={0.25}
        opacity={0.5}
        color="#ffc667"
      />
    </>
  );
}

export default function GalaxyScene({ progress, active }: GalaxySceneProps) {
  return (
    <Canvas
      // El canvas se monta temprano para el warm-up, pero el loop solo corre
      // cuando hay estrellas visibles — fuera de la ventana no dibuja nada
      frameloop={active ? "always" : "never"}
      // Móvil primero: DPR limitado, sin AA (las estrellas son puntos), bajo consumo
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 60 }}
      gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
      // R3F fuerza pointer-events:auto en su wrapper interno, lo que
      // reactivaría la captura de clicks sobre todo el capítulo aunque el
      // contenedor padre sea pointer-events-none — la escena no es interactiva
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden
    >
      <DriftingStars />
      <CameraRig progress={progress} />
    </Canvas>
  );
}
