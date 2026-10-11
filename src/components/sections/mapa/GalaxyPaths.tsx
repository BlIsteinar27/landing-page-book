"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

interface GalaxyPathsProps {
  /** Progreso local del capítulo oscuro (0-1) */
  progress: MotionValue<number>;
}

// Trazos estimados sobre el arte del mapa (viewBox 3986x2631).
// Coordenadas derivadas de mapa-galaxias.webp — afinables cuando haya
// un trazado manual definitivo (Task 4.1 Step 1 del plan).
const ROUTES = [
  // Corona central → Völdrath → Vektra
  "M 1634 1394 Q 2100 1150 2471 1052 Q 2750 900 2671 710",
  // Corona central → llama → Quiris → Calisa
  "M 1634 1394 Q 2050 1470 2471 1447 Q 2800 1420 3029 1394 Q 3350 1520 3587 1789",
  // Völdrath → Thalis → Zavrek
  "M 2471 1052 Q 2250 1650 2312 2210 Q 2550 2330 2910 2078",
];
const RINGS = [
  { cx: 1634, cy: 1394, r: 300 }, // Corona central
  { cx: 2671, cy: 710, r: 280 }, // Galaxia Vektra
  { cx: 3508, cy: 999, r: 260 }, // Galaxia Thranok
  { cx: 2910, cy: 2078, r: 280 }, // Galaxia Zavrek
];
// Vacío a propósito: los nombres de las galaxias ya vienen dibujados en el
// arte y el plan prohíbe inventar nombres de regiones. Añadir solo si se
// quieren callouts con los nombres reales.
const LABELS: { x: number; y: number; text: string }[] = [];

export default function GalaxyPaths({ progress }: GalaxyPathsProps) {
  const draw = useTransform(progress, [0.3, 0.9], [0, 1]);
  const labelOpacity = useTransform(progress, [0.7, 0.9], [0, 1]);

  return (
    <svg
      viewBox="0 0 3986 2631"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    >
      {ROUTES.map((d, i) => (
        <motion.path
          key={`route-${i}`}
          d={d}
          fill="none"
          stroke="var(--color-accent, currentColor)"
          className="text-accent"
          strokeWidth={3}
          strokeDasharray="1"
          style={{ pathLength: draw }}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {RINGS.map((c, i) => (
        <motion.circle
          key={`ring-${i}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          fill="none"
          className="text-accent/60"
          stroke="currentColor"
          strokeWidth={2}
          style={{ pathLength: draw }}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {LABELS.map((l, i) => (
        <motion.text
          key={`label-${i}`}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          className="fill-ink-primary font-display"
          fontSize={64}
          style={{ opacity: labelOpacity }}
        >
          {l.text}
        </motion.text>
      ))}
    </svg>
  );
}
