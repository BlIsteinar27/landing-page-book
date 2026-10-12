"use client";

import { m, useReducedMotion } from "motion/react";

// Tabla fija (determinista, SSR-safe): x%, y%, tamaño, delay, duración
const DUST = [
  { x: 8, y: 20, s: 2.2, d: 0.0, t: 5.2 },
  { x: 22, y: 65, s: 1.4, d: 0.8, t: 6.1 },
  { x: 35, y: 15, s: 2.8, d: 1.6, t: 4.8 },
  { x: 47, y: 80, s: 1.6, d: 0.4, t: 6.8 },
  { x: 58, y: 30, s: 2.0, d: 2.1, t: 5.5 },
  { x: 66, y: 55, s: 1.2, d: 1.1, t: 7.0 },
  { x: 74, y: 12, s: 2.5, d: 0.6, t: 5.0 },
  { x: 82, y: 70, s: 1.8, d: 1.9, t: 6.3 },
  { x: 90, y: 40, s: 1.5, d: 0.2, t: 5.8 },
  { x: 15, y: 85, s: 2.4, d: 2.5, t: 4.6 },
  { x: 42, y: 45, s: 1.3, d: 1.4, t: 6.6 },
  { x: 70, y: 88, s: 2.1, d: 0.9, t: 5.4 },
];

interface CosmicDustProps {
  /** Variante ambiental por reino */
  variant?: "light" | "central" | "dark";
}

// Carácter por reino: en Luz las motas ascienden (lo divino sube), en Central
// derivan más lento con vaivén lateral (polen/niebla terrenal). En Oscuro no
// hay RISE: el polvo estelar respira en el sitio, suspendido
const RISE: Record<
  "light" | "central",
  { dist: number; sway: number; peak: number; grow: number }
> = {
  light: { dist: 170, sway: 0, peak: 1, grow: 1.4 },
  central: { dist: 110, sway: 18, peak: 0.9, grow: 1.25 },
};

export default function CosmicDust({ variant = "dark" }: CosmicDustProps) {
  const reduce = useReducedMotion();
  const rise =
    variant === "light" || variant === "central" ? RISE[variant] : undefined;
  // Las motas ascendentes se leen como «partículas», no como polvo: más
  // grandes y con más brillo que el dust ambiental del reino oscuro
  const dotSize = (s: number) => (rise ? s * 2.7 : s);

  // Igual que DivineParticles: decorativo en bucle, fuera con reduced motion
  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {DUST.map((p, i) => (
        <m.span
          key={`dust-${i}`}
          className={`absolute rounded-full blur-[1px] ${
            rise ? "bg-accent/90" : "bg-accent/30"
          }`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: dotSize(p.s),
            height: dotSize(p.s),
          }}
          animate={
            rise
              ? {
                  opacity: [0, rise.peak, 0],
                  y: [0, -rise.dist],
                  x: rise.sway ? [0, rise.sway, -rise.sway / 2, 0] : 0,
                  scale: [0.7, rise.grow],
                }
              : {
                  opacity: [0, 0.6, 0],
                  y: [0, -30, 0],
                  scale: [1, 1.5, 1],
                }
          }
          transition={{
            duration: p.t,
            repeat: Infinity,
            delay: p.d,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
