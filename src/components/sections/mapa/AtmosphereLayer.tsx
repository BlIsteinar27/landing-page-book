"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import CosmicDust from "@/components/ui/CosmicDust";

interface AtmosphereLayerProps {
  progress: MotionValue<number>;
  range: [number, number];
  /** Variante cromática por reino (tokens de marca, nada de colores ajenos) */
  variant: "light" | "central" | "dark";
  /** true mientras la opacidad del capítulo > 0 — pausa el dust invisible */
  active: boolean;
}

const VARIANT_CLASS: Record<AtmosphereLayerProps["variant"], string> = {
  // Nieblas suaves con los tokens existentes — todas terminan en transparente:
  // un color al final del gradiente dejaba el filo de la banda h-2/3 a la vista
  light: "bg-gradient-to-t from-accent/10 via-transparent to-transparent",
  central: "bg-gradient-to-t from-surface-2/40 via-transparent to-transparent",
  dark: "bg-gradient-to-t from-purple-medium/20 via-transparent to-transparent",
};

// Pico de opacidad del halo por variante: en el mapa oscuro un halo fuerte
// se lee como un "parche iluminado" sobre el arte; ahí va mucho más suave
const GLOW_PEAK: Record<AtmosphereLayerProps["variant"], number> = {
  light: 0.45,
  central: 0.4,
  dark: 0.18,
};

export default function AtmosphereLayer({
  progress,
  range,
  variant,
  active,
}: AtmosphereLayerProps) {
  const [start, end] = range;
  // Tres capas a distinta velocidad = profundidad sin recortar el arte
  const fogY = useTransform(progress, [start, end], ["6%", "-6%"]);
  const mistY = useTransform(progress, [start, end], ["-3%", "3%"]);
  const glowOpacity = useTransform(
    progress,
    [start, (start + end) / 2, end],
    [0, GLOW_PEAK[variant], 0],
  );

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {/* Niebla baja ascendente */}
      <m.div
        style={{ y: fogY }}
        className={`absolute inset-x-0 bottom-0 h-2/3 ${VARIANT_CLASS[variant]}`}
      />
      {/* Bruma alta descendente */}
      <m.div
        style={{ y: mistY }}
        className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/25 to-transparent"
      />
      {/* Halo central que respira con el capítulo */}
      <m.div
        style={{ opacity: glowOpacity }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_60%)] opacity-0 mix-blend-screen"
      />
      {active && <CosmicDust variant={variant} />}
    </div>
  );
}
